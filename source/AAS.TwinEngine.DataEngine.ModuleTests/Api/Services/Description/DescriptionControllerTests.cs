using System.Net;
using System.Net.Http.Json;
using System.Text.Json.Nodes;

using AAS.TwinEngine.DataEngine.ApplicationLogic.Exceptions.Base;
using AAS.TwinEngine.DataEngine.ApplicationLogic.Exceptions.Infrastructure;
using AAS.TwinEngine.DataEngine.ApplicationLogic.Services.Description;
using AAS.TwinEngine.DataEngine.DomainModel.Description;
using AAS.TwinEngine.DataEngine.ModuleTests.Common;

using Microsoft.Extensions.DependencyInjection;

using NSubstitute;
using NSubstitute.ExceptionExtensions;

namespace AAS.TwinEngine.DataEngine.ModuleTests.Api.Services.Description;

public abstract class DescriptionControllerTests : IDisposable
{
    private readonly ConfigTestFactory _factory;
    private readonly IDescriptionService _mockDescriptionService;
    private readonly HttpClient _client;

    protected DescriptionControllerTests(string configDir)
    {
        _mockDescriptionService = Substitute.For<IDescriptionService>();

        _factory = new ConfigTestFactory(configDir, services =>
        {
            _ = services.AddSingleton(_mockDescriptionService);
        });

        _client = _factory.CreateClient();
    }

    public void Dispose()
    {
        _client.Dispose();
        _factory.Dispose();
        GC.SuppressFinalize(this);
    }

    [Fact]
    public async Task GetDescriptor_ReturnsOkAsync()
    {
        _ = _mockDescriptionService
            .GetDescriptor(Arg.Any<CancellationToken>())
            .Returns(new ServiceDescription
            {
                Profiles =
                [
                    "https://admin-shell.io/aas/API/3/1/AssetAdministrationShellRegistryServiceSpecification/SSP-002"
                ]
            });

        var response = await _client.GetAsync("/description");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var json = await response.Content.ReadFromJsonAsync<JsonObject>();

        Assert.NotNull(json);
    }

    [Fact]
    public async Task GetDescriptor_WhenForbidden_Returns403Async()
    {
        _ = _mockDescriptionService
            .GetDescriptor(Arg.Any<CancellationToken>())
            .Throws(new ForbiddenException());

        var response = await _client.GetAsync("/description");

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task GetDescriptor_WhenInternalServerError_Returns500Async()
    {
        _ = _mockDescriptionService
            .GetDescriptor(Arg.Any<CancellationToken>())
            .Throws(new ResponseParsingException());

        var response = await _client.GetAsync("/description");

        Assert.Equal(HttpStatusCode.InternalServerError, response.StatusCode);
    }
}

public class DescriptionControllerTestsV1Config() : DescriptionControllerTests("v1-config");

public class DescriptionControllerTestsV2Config() : DescriptionControllerTests("v2-config");
